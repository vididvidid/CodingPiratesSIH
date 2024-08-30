import requests
import pandas as pd

def read_excel_text(file_path):
    """Reads text from an Excel file and returns it as a string."""
    try:
        df = pd.read_excel(file_path)
        print(df)
        return df.to_string(index=False)  # Simplify by not including row indices
    except Exception as e:
        return f"Error reading Excel file: {e}"

def simulate_bard_response(prompt, API_KEY):
    """Sends a prompt to the Bard API and returns the generated response."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={API_KEY}"
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        response_data = response.json()
        if "candidates" in response_data:
            return response_data["candidates"][0]["content"]["parts"][0]["text"]
        return "Error: 'candidates' key not found in response data"
    return f"Error: {response.status_code}"

def main():
    API_KEY = "AIzaSyAxfHEepLbxZmB2RUGJrWuOaa8pLAx79Sk"  # Replace with your actual API Key
    file_path = "C:/Users/vidid/Downloads/Book1.xlsx"  # Replace with your actual file path

    # Read text from the specified Excel file
    excel_text = read_excel_text(file_path)
    
    # Create a prompt for hierarchical ordering
    prompt = f"Give only one hirerachy it follow perfectly, create the hirerachy based on the file content i will provide in which order it will follow like education institute -> department of computer science -> academic performance -> student grades , education institute -> department of computer science -> academic performance -> course completion rates, education institute -> department of computer science -> financial statements ,education institute -> department of computer science -> infrastructuer development,education institute -> department of computer science -> student and faculty achievements,education institute -> department of computer science -> extracurricular activities,education institute -> department of mathematics -> academic performance -> student grades ,education institute -> department of mathematics -> academic performance -> course completion rates,education institute -> department of mathematics -> financial statements ,education institute -> department of mathematics -> infrastructuer development,education institute -> department of mathematics -> student and faculty achievements,education institute -> department of mathematics -> extracurricular activities,( it should be comma seperated ) \n{excel_text}"
    
    # Get response from Bard API
    bard_response = simulate_bard_response(prompt, API_KEY)
    
    # Print Bard's response
    print(f"Bard's response:\n{bard_response}")

if __name__ == "__main__":
    main()
