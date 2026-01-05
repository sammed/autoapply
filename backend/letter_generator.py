import openai
from PyPDF2 import PdfReader

# Set up OpenAI API key
openai.api_key = "your-openai-api-key"


def read_pdf(file_path):
    with open(file_path, "rb") as file:
        pdf = PdfReader(file)
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text


def generate_adapted_letter(application):
    # Read the original merit letter
    original_letter = read_pdf("./personligbrev.pdf")

    # Prepare the prompt for OpenAI
    prompt = f"""
    Original merit letter:
    {original_letter}

    Job description:
    {application['description']}

    Please adapt the original merit letter to fit this specific job application. 
    Highlight relevant skills and experiences that match the job requirements.
    Keep the letter concise and professional.
    """

    # Generate adapted letter using OpenAI
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=500,
        n=1,
        stop=None,
        temperature=0.7,
    )

    return response.choices[0].text.strip()
