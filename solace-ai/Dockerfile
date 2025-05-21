# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

RUN mkdir -p /app/config

# Install dependencies
COPY requirements.txt /app

RUN python3.12 -m pip install -r requirements.txt
ENV PYTHONUNBUFFERED=1

# Command to run the application
# Customize this based on your specific use case
CMD ["solace-ai-connector", "/app/config/configuration.yaml"]