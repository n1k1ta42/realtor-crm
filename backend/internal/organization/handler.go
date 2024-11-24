package organization

import (
	"net/http"
)

type HandlerOrganizationDeps struct {
}

type HandlerOrganization struct {
}

func NewHandlerOrganizations(router *http.ServeMux, deps HandlerOrganizationDeps) {
	handler := &HandlerOrganization{}
	router.HandleFunc("GET /organization/list", handler.List())
	router.HandleFunc("GET /organization/{id}", handler.ById())
	router.HandleFunc("POST /organization", handler.Create())
	router.HandleFunc("PATCH /organization/{id}", handler.Update())
	router.HandleFunc("DELETE /organization/{id}", handler.Delete())
}

func (h *HandlerOrganization) List() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerOrganization) ById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerOrganization) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerOrganization) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerOrganization) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}
