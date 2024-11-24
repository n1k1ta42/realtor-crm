package object

import (
	"net/http"
)

type HandlerObjectDeps struct {
}

type HandlerObject struct {
}

func NewHandlerObjects(router *http.ServeMux, deps HandlerObjectDeps) {
	handler := &HandlerObject{}
	router.HandleFunc("GET /object/list", handler.List())
	router.HandleFunc("GET /object/{id}", handler.ById())
	router.HandleFunc("POST /object", handler.Create())
	router.HandleFunc("PATCH /object/{id}", handler.Update())
	router.HandleFunc("DELETE /object/{id}", handler.Delete())
}

func (h *HandlerObject) List() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerObject) ById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerObject) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerObject) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerObject) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}
