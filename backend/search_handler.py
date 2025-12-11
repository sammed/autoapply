import requests
import json
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# API configuration (replace with actual API keys and endpoints)
INDEED_API_KEY = "your_indeed_api_key"
INDEED_API_URL = "https://api.indeed.com/ads/apisearch"

ARBETSFORMEDLINGEN_API_URL = (
    "https://api.arbetsformedlingen.se/af/v0/platsannonser/matchning"
)

CAREERJET_API_KEY = "your_careerjet_api_key"
CAREERJET_API_URL = "http://public.api.careerjet.net/search"


def search_indeed(query, location):
    params = {
        "publisher": INDEED_API_KEY,
        "q": query,
        "l": location,
        "format": "json",
        "v": "2",
    }
    response = requests.get(INDEED_API_URL, params=params)
    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        logger.error(f"Indeed API error: {response.status_code}")
        return []


url = "https://jobsearch.api.jobtechdev.se"
url_for_search = f"{url}/search"


def _get_ads(params):
    headers = {"accept": "application/json"}
    response = requests.get(url_for_search, headers=headers, params=params)
    response.raise_for_status()  # check for http errors
    return json.loads(response.content.decode("utf8"))


def search_arbetsformedlingen_ads_amount(query):
    # limit: 0 means no ads, just a value of how many ads were found.
    search_params = {"q": query, "limit": 0}
    json_response = _get_ads(search_params)
    print(json_response)
    number_of_hits = json_response["total"]["value"]
    print(f"\nNumber of hits = {number_of_hits}")


def search_arbetsformedlingen(query):
    # limit = 100 is the max number of hits that can be returned.
    # If there are more (which you find with ['total']['value'] in the json response)
    # you have to use offset and multiple requests to get all ads.
    search_params = {"q": query, "limit": 100}
    json_response = _get_ads(search_params)
    hits = json_response["hits"]
    for hit in hits:
        print(f"{hit['headline']}, {hit['employer']['name']}")
    return hits;


def search_careerjet(query, location):
    params = {
        "affid": CAREERJET_API_KEY,
        "keywords": query,
        "location": location,
        "locale_code": "en_SE",
    }
    response = requests.get(CAREERJET_API_URL, params=params)
    if response.status_code == 200:
        return response.json().get("jobs", [])
    else:
        logger.error(f"CareerJet API error: {response.status_code}")
        return []


def aggregate_job_search(query):
    all_jobs = []

    # Indeed search
    # indeed_jobs = search_indeed(query, location)
    # all_jobs.extend([{"source": "Indeed", "data": job} for job in indeed_jobs])
    # time.sleep(1)  # Respect Indeed's rate limit

    # Arbetsförmedlingen search
    af_jobs_amount = search_arbetsformedlingen(query)

    all_jobs.extend(
        [{"source": "Arbetsförmedlingen", "data": job} for job in af_jobs_amount]
    )

    # CareerJet search
    # careerjet_jobs = search_careerjet(query, location)
    # all_jobs.extend([{"source": "CareerJet", "data": job} for job in careerjet_jobs])

    return all_jobs
