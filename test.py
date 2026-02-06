import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY") or "")

# List available models
print("Available models:")
for m in genai.list_models():
    print("-", m.name)

print("\nTesting model...\n")

# USE FREE MODEL
model = genai.GenerativeModel("gemini-2.5-flash")
res = model.generate_content("Say hello")

print(res.text)
