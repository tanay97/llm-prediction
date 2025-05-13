import itertools
import math
import os
from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

CLIENT_PORT = os.environ.get("CLIENT_PORT", "3000")
CLIENT_ORIGIN = f"http://localhost:{CLIENT_PORT}"
BACKEND_PORT = int(os.environ.get("BACKEND_PORT", "8000"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[CLIENT_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def reconstruct_topk_paths(top_logprobs):
    # Step 1: expand options per step
    options_per_step = [[(tok, lp) for tok, lp in step.items()] for step in top_logprobs]
    all_paths = list(itertools.product(*options_per_step))

    results = []
    for path in all_paths:
        tokens, logprobs = zip(*path)
        full_text = ''.join(tokens)
        total_logprob = sum(logprobs)
        results.append((full_text, total_logprob))

    # Step 2: Normalize using log-sum-exp trick
    logprobs_only = [lp for _, lp in results]
    max_logprob = max(logprobs_only)
    probs = [math.exp(lp - max_logprob) for lp in logprobs_only]
    sum_probs = sum(probs)

    return [
        {'text': text, 'logprob': lp, 'prob': prob / sum_probs}
        for (text, lp), prob in zip(results, probs) if prob > 0.01
    ]


@app.get("/logprobs")
def get_logprobs(
    prompt: str = Query(..., description="Prompt to get logprobs for"),
    temperature: float = Query(0.5, description="Sampling temperature for generation")
):
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    response = client.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=3,
        logprobs=20,
        temperature=temperature
    )
    paths = reconstruct_topk_paths(response.choices[0].logprobs.top_logprobs)
    paths = sorted(paths, key=lambda x: x['prob'], reverse=True)[:10]
    
    return JSONResponse(content={
        "model_output": max(paths, key=lambda x: x['prob'])['text'],
        "other_paths": paths
    })

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=BACKEND_PORT, reload=True)
