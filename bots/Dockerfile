# Use official Python image as base
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (for pymongo, dnspython, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Set environment variables (can be overridden at runtime)
ENV PYTHONUNBUFFERED=1

# Fix import error: main.py should import LLMClient from llm, not llm_client
RUN sed -i 's/from llm_client import LLMClient/from llm import LLMClient/' main.py

# Default command
CMD ["python", "main.py"]