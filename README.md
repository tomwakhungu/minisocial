# MiniSocial - DevOps Practice Project

A full-stack social media application with complete CI/CD pipeline and Kubernetes deployment.

## Features
- User authentication
- Post creation
- Likes and comments
- Real-time updates

## Tech Stack
- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Orchestration**: Kubernetes (kind)

## Quick Start

### Local Development with Docker Compose
```bash
docker-compose up --build
```
Visit: http://localhost:3000

### Deploy to Kubernetes
```bash
# Create kind cluster
kind create cluster --name minisocial-cluster

# Deploy application
kubectl apply -f k8s/

# Access application
kubectl port-forward svc/frontend-service 8080:80 -n minisocial
```
Visit: http://localhost:8080

## Project Structure
```
minisocial/
├── backend/          # Node.js backend
├── frontend/         # React frontend
├── k8s/             # Kubernetes manifests
├── .github/         # GitHub Actions workflows
└── docker-compose.yml
```

## License
MIT
