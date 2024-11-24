package deal

import (
	"net/http"
)

type HandlerDealDeps struct {
}

type HandlerDeal struct {
}

func NewHandlerDeals(router *http.ServeMux, deps HandlerDealDeps) {
	handler := &HandlerDeal{}
	router.HandleFunc("GET /deal/list", handler.List())
	router.HandleFunc("GET /deal/{id}", handler.ById())
	router.HandleFunc("POST /deal", handler.Create())
	router.HandleFunc("PATCH /deal/{id}", handler.Update())
	router.HandleFunc("DELETE /deal/{id}", handler.Delete())
}

func (h *HandlerDeal) List() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerDeal) ById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerDeal) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerDeal) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}

func (h *HandlerDeal) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {}
}
