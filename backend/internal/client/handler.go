package client

import (
	"net/http"
)

type HandlerClientDeps struct {
}

type HandlerClient struct {
}

func NewHandlerClients(router *http.ServeMux, deps HandlerClientDeps) {
	handler := &HandlerClient{}
	router.HandleFunc("GET /client/list", handler.List())
	router.HandleFunc("GET /client/{id}", handler.ById())
	router.HandleFunc("POST /client", handler.Create())
	router.HandleFunc("PATCH /client/{id}", handler.Update())
	router.HandleFunc("DELETE /client/{id}", handler.Delete())
}

func (h *HandlerClient) List() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerClient) ById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerClient) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerClient) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerClient) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}
