import os
from groq import Groq
from dotenv import load_dotenv
from models.schemas import SchemeRequest, Scheme, SchemesResponse

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

# ── Known Indian Agricultural Schemes Database ────────────
SCHEMES_DB = [
    {
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "benefit": "₹6,000/year direct income support in 3 installments",
        "eligibility": "All small and marginal farmer families with cultivable land",
        "how_to_apply": "Visit pmkisan.gov.in or nearest Common Service Centre (CSC)",
        "link": "https://pmkisan.gov.in",
        "max_acres": 9999,
        "min_acres": 0,
    },
    {
        "name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "benefit": "Crop insurance covering natural calamities, pests & diseases",
        "eligibility": "All farmers growing notified crops. Premium: 2% for Kharif, 1.5% for Rabi",
        "how_to_apply": "Apply through bank, CSC, or pmfby.gov.in before sowing season",
        "link": "https://pmfby.gov.in",
        "max_acres": 9999,
        "min_acres": 0,
    },
    {
        "name": "Kisan Credit Card (KCC)",
        "ministry": "Ministry of Agriculture & Farmers Welfare / RBI",
        "benefit": "Short-term credit up to ₹3 lakh at 4% interest for farming needs",
        "eligibility": "All farmers, sharecroppers, self-help groups engaged in agriculture",
        "how_to_apply": "Apply at any nationalised bank, cooperative bank, or RRB",
        "link": "https://www.nabard.org/content.aspx?id=576",
        "max_acres": 9999,
        "min_acres": 0,
    },
    {
        "name": "PM Krishi Sinchayee Yojana (PMKSY)",
        "ministry": "Ministry of Jal Shakti",
        "benefit": "Subsidy up to 55% for micro-irrigation (drip/sprinkler) equipment",
        "eligibility": "Farmers with own or leased land who want to adopt water-efficient irrigation",
        "how_to_apply": "Contact district agriculture officer or apply via state agriculture portal",
        "link": "https://pmksy.gov.in",
        "max_acres": 9999,
        "min_acres": 0,
    },
    {
        "name": "National Food Security Mission (NFSM)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "benefit": "Free/subsidised seeds, fertilizers, farm machinery for rice, wheat, pulses",
        "eligibility": "Farmers in selected districts growing rice, wheat, pulses, or coarse cereals",
        "how_to_apply": "Contact local Krishi Vigyan Kendra (KVK) or block agriculture officer",
        "link": "https://nfsm.gov.in",
        "max_acres": 9999,
        "min_acres": 0,
    },
    {
        "name": "Sub-Mission on Agricultural Mechanization (SMAM)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "benefit": "25–50% subsidy on tractors, power tillers, and farm equipment",
        "eligibility": "Small and marginal farmers (priority). SC/ST farmers get higher subsidy",
        "how_to_apply": "Apply through state agriculture department's online portal",
        "link": "https://agrimachinery.nic.in",
        "max_acres": 5,
        "min_acres": 0,
    },
    {
        "name": "Soil Health Card Scheme",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "benefit": "Free soil testing + personalised fertilizer recommendations every 2 years",
        "eligibility": "All farmers across India",
        "how_to_apply": "Contact nearest soil testing lab or Krishi Vigyan Kendra",
        "link": "https://soilhealth.dac.gov.in",
        "max_acres": 9999,
        "min_acres": 0,
    },
    {
        "name": "e-NAM (National Agriculture Market)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "benefit": "Online trading platform — sell crops at best market price across India",
        "eligibility": "All farmers with Aadhaar and bank account",
        "how_to_apply": "Register at enam.gov.in or through your local APMC mandi",
        "link": "https://enam.gov.in",
        "max_acres": 9999,
        "min_acres": 0,
    },
]


async def find_schemes(request: SchemeRequest) -> SchemesResponse:
    matched = [
        s for s in SCHEMES_DB
        if s["min_acres"] <= request.land_acres <= s["max_acres"]
    ]

    prompt = f"""
A farmer in {request.state} has {request.land_acres} acres, grows {request.crop_type}.
They are eligible for these government schemes: {[s['name'] for s in matched]}.
Write a warm, encouraging 2-sentence message in simple English telling them
how many schemes they qualify for and encouraging them to apply.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
        )
        message = response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq API error: {e}")
        message = f"Great news! You qualify for {len(matched)} government schemes. Please apply soon to avail these benefits."

    return SchemesResponse(
        schemes=[
            Scheme(
                name=s["name"],
                ministry=s["ministry"],
                benefit=s["benefit"],
                eligibility=s["eligibility"],
                how_to_apply=s["how_to_apply"],
                link=s["link"],
            )
            for s in matched
        ],
        total_found=len(matched),
        message=message,
    )