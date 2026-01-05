# Step 1: Base image for Python backend
FROM python:3.12-slim AS backend

# Set working directory in the container
WORKDIR /app

# Copy the requirements file to install dependencies
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend source code
COPY . .

# Expose the backend port
EXPOSE 5000

# Command to run the backend
CMD ["python", "app.py"]
