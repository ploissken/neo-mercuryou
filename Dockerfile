FROM node:23-slim

# Install Python and build tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-setuptools \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Continue with app setup
WORKDIR /home/node
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]