from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage
import os
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Text Refinement API",
    description="API for refining text and generating titles using Gemini AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class TextInput(BaseModel):
    text: str = Field(..., description="The text to be refined or analyzed", min_length=1)
    tone: Optional[str] = Field(default="professional", description="Desired tone for refinement (professional, casual, formal, creative)")
    max_length: Optional[int] = Field(default=None, description="Maximum length for refined text")

class RefinedTextResponse(BaseModel):
    original_text: str
    refined_text: str
    tone: str
    improvements_made: list[str]

class TitleResponse(BaseModel):
    original_text: str
    suggested_titles: list[str]
    primary_title: str

def get_gemini_llm():
    """Initialize and return Gemini LLM instance"""
    api_key = "AIzaSyCX9mI09v_cJEjXJgAeQ4AJGUPd0U8RAFY"
    if not api_key:
        raise HTTPException(
            status_code=500, 
            detail="GOOGLE_API_KEY environment variable not set"
        )
    
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=api_key,
        temperature=0.7,
        convert_system_message_to_human=True
    )

TEXT_REFINEMENT_PROMPT = PromptTemplate(
    input_variables=["text", "tone", "max_length_instruction"],
    template="""You are an expert editor and writing coach. Your task is to refine and improve the given text while maintaining its core message and intent.

INSTRUCTIONS:
- Improve clarity, readability, and flow
- Enhance vocabulary and sentence structure
- Ensure proper grammar and punctuation
- Maintain the original meaning and key points
- Adopt a {tone} tone throughout
- {max_length_instruction}
- Make the text more engaging and impactful

ORIGINAL TEXT:
{text}

Please provide your refined version along with a brief list of the main improvements you made. Format your response as:

REFINED TEXT:
[Your improved version here]

IMPROVEMENTS MADE:
- [List key improvements as bullet points]
"""
)

TITLE_GENERATION_PROMPT = PromptTemplate(
    input_variables=["text"],
    template="""You are a creative title generator and content strategist. Analyze the following text and create compelling, relevant titles.

INSTRUCTIONS:
- Read and understand the core message, theme, and key points
- Generate titles that are attention-grabbing yet accurate
- Consider different styles: descriptive, creative, actionable, question-based
- Ensure titles are appropriate for the content type and audience
- Make titles concise but informative (ideally 5-12 words)
- Create titles that would work well for articles, blog posts, or documents

TEXT TO ANALYZE:
{text}

Please provide multiple title options and identify the best one. Format your response as:

SUGGESTED TITLES:
1. [Title option 1]
2. [Title option 2]
3. [Title option 3]
4. [Title option 4]
5. [Title option 5]

PRIMARY RECOMMENDATION:
[The best title from the list above]

REASONING:
[Brief explanation of why the primary title works best]
"""
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Text Refinement API is running",
        "version": "1.0.0",
        "endpoints": {
            "refine_text": "/refine-text",
            "generate_title": "/generate-title"
        }
    }

@app.post("/refine-text", response_model=RefinedTextResponse)
async def refine_text(input_data: TextInput):
    """
    Refine and improve the provided text using Gemini AI
    
    - **text**: The text to be refined
    - **tone**: Desired tone (professional, casual, formal, creative)
    - **max_length**: Optional maximum length constraint
    """
    try:
        logger.info(f"Refining text with tone: {input_data.tone}")
        
        llm = get_gemini_llm()
        
        max_length_instruction = ""
        if input_data.max_length:
            max_length_instruction = f"Keep the refined text under {input_data.max_length} characters"
        else:
            max_length_instruction = "Maintain appropriate length for the content"
        
        prompt = TEXT_REFINEMENT_PROMPT.format(
            text=input_data.text,
            tone=input_data.tone,
            max_length_instruction=max_length_instruction
        )
        
        response = llm.invoke([HumanMessage(content=prompt)])
        response_text = response.content
        
        parts = response_text.split("IMPROVEMENTS MADE:")
        if len(parts) >= 2:
            refined_text = parts[0].replace("REFINED TEXT:", "").strip()
            improvements_text = parts[1].strip()
            improvements = [
                imp.strip().lstrip("- ").lstrip("• ")
                for imp in improvements_text.split("\n")
                if imp.strip() and not imp.strip().startswith("REFINED TEXT:")
            ]
        else:
            refined_text = response_text.strip()
            improvements = ["Text has been refined for better clarity and flow"]
        
        return RefinedTextResponse(
            original_text=input_data.text,
            refined_text=refined_text,
            tone=input_data.tone,
            improvements_made=improvements
        )
        
    except Exception as e:
        logger.error(f"Error refining text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error refining text: {str(e)}")

@app.post("/generate-title", response_model=TitleResponse)
async def generate_title(input_data: TextInput):
    """
    Generate compelling titles for the provided text using Gemini AI
    
    - **text**: The text to generate titles for
    """
    try:
        logger.info("Generating titles for provided text")
        
        llm = get_gemini_llm()
        prompt = TITLE_GENERATION_PROMPT.format(text=input_data.text)
        
        response = llm.invoke([HumanMessage(content=prompt)])
        response_text = response.content
        
        suggested_titles = []
        primary_title = ""
        
        lines = response_text.split("\n")
        in_titles_section = False
        
        for line in lines:
            line = line.strip()
            if "SUGGESTED TITLES:" in line:
                in_titles_section = True
                continue
            elif "PRIMARY RECOMMENDATION:" in line:
                in_titles_section = False
                continue
            elif "REASONING:" in line:
                break
            
            if in_titles_section and line:
                if line[0].isdigit() and "." in line:
                    title = line.split(".", 1)[1].strip()
                    suggested_titles.append(title)
                elif line.startswith("-") or line.startswith("•"):
                    title = line[1:].strip()
                    suggested_titles.append(title)
            elif not in_titles_section and line and not primary_title:
                if not line.startswith("REASONING:") and not line.startswith("PRIMARY"):
                    primary_title = line
        
        if not primary_title and suggested_titles:
            primary_title = suggested_titles[0]
        
        if not suggested_titles:
            suggested_titles = ["Generated Title 1", "Generated Title 2", "Generated Title 3"]
            primary_title = "Generated Title 1"
        
        return TitleResponse(
            original_text=input_data.text,
            suggested_titles=suggested_titles,
            primary_title=primary_title
        )
        
    except Exception as e:
        logger.error(f"Error generating titles: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating titles: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        get_gemini_llm()
        return {"status": "healthy", "gemini_api": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
