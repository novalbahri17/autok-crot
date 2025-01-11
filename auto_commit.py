import os
import random
import subprocess
import requests
from datetime import datetime

# Fetch a random quote
def fetch_quote():
    response = requests.get("https://zenquotes.io/api/random")
    if response.status_code == 200:
        quote_data = response.json()
        return f"{quote_data[0]['q']} - {quote_data[0]['a']}"
    else:
        return "Tidak ada kutipan hari ini."

# Write the quote and add a random string to ensure unique changes
def write_quote_to_file(quote):
    random_string = str(random.randint(1000, 9999))
    with open("RANDOM_QUOTE.txt", "w") as file:
        file.write(f"{quote}\n{random_string}")

# Commit changes
def commit_changes(quote, index):
    subprocess.run(["git", "add", "RANDOM_QUOTE.txt"], check=True)
    subprocess.run(
        ["git", "commit", "-m", f"Automated commit #{index}: {quote}"],
        check=True,
    )

# Main script
if __name__ == "__main__":  # Fixed from _name_ to __name__
    num_commits = random.randint(6, 10)  # Random number of commits between 6 and 10
    for i in range(1, num_commits + 1):
        quote = fetch_quote()
        write_quote_to_file(quote)
        try:
            commit_changes(quote, i)
            print(f"Commit #{i} berhasil: {quote}")
        except subprocess.CalledProcessError as e:
            print(f"Error pada commit #{i}: {e}")
            break
    print(f"Total commits hari ini: {i}")
