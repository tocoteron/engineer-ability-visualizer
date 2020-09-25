FROM golang:alpine as build-reflex
RUN apk update && \
    apk upgrade && \
    apk add bash git && \
    rm -rf /var/cache/apk/*

RUN go get github.com/cespare/reflex

FROM golang:alpine
COPY --from=build-reflex /go/bin/reflex /go/bin/reflex

RUN apk update && \
    apk upgrade && \
    apk add bash git build-base && \
    rm -rf /var/cache/apk/*

ENV GOOS=linux \
    GOARCH=amd64 \
    CGO_ENABLED=0

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .