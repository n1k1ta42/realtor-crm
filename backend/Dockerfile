# backend/Dockerfile

# Stage 1: Build
FROM golang:1.23.3-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o backend cmd/main.go

# Stage 2: Run
FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/backend .

EXPOSE 8080

CMD ["./backend"]
