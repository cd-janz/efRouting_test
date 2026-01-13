# --- Stage 1: Builder ---
FROM golang:1.25-alpine AS builder

RUN apk update && apk add --no-cache git ca-certificates tzdata

WORKDIR /app

ENV GOPROXY=https://proxy.golang.org,direct

COPY . .

RUN rm -f go.sum && go mod tidy

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /main ./cmd/api/main.go

FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /main /main

EXPOSE 8080

ENTRYPOINT ["/main"]