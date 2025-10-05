# Use official Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all files into container
COPY . .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose the default HF Spaces port
EXPOSE 7860

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]
