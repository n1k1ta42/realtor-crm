package deal

import (
	"log"
	"net/http"
	"realtor-crm-backend/configs"
	"realtor-crm-backend/pkg/middleware"
	"realtor-crm-backend/pkg/req"
	"realtor-crm-backend/pkg/res"
	"strconv"
)

type HandlerDealDeps struct {
	DealRepository *RepositoryDeal
	DealService    *ServiceDeal
	Config         *configs.Config
}

type HandlerDeal struct {
	DealRepository *RepositoryDeal
	DealService    *ServiceDeal
}

func NewHandlerDeals(router *http.ServeMux, deps HandlerDealDeps) {
	handler := &HandlerDeal{
		DealRepository: deps.DealRepository,
		DealService:    deps.DealService,
	}
	router.Handle("GET /deal/list", middleware.IsAuthed(handler.List(), deps.Config))
	router.Handle("GET /deal/{id}", middleware.IsAuthed(handler.ById(), deps.Config))
	router.Handle("POST /deal", middleware.IsAuthed(handler.Create(), deps.Config))
	router.Handle("PATCH /deal/{id}", middleware.IsAuthed(handler.Update(), deps.Config))
	router.Handle("DELETE /deal/{id}", middleware.IsAuthed(handler.Delete(), deps.Config))
}

func (h *HandlerDeal) List() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusBadRequest, "invalid limit")
			return
		}
		offset, err := strconv.Atoi(r.URL.Query().Get("offset"))
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusBadRequest, "invalid offset")
			return
		}
		list, err := h.DealService.List(limit, offset)
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, list)
	}
}

func (h *HandlerDeal) ById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		deal, err := h.DealRepository.ById(uint(id))
		if err != nil {
			res.Json(w, http.StatusNotFound, "deal not found")
			return
		}
		res.Json(w, http.StatusOK, deal)
	}
}

func (h *HandlerDeal) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[CreateDealRequest](&w, r)
		if err != nil {
			return
		}
		createdDeal, err := h.DealService.Create(body.UserId, body.ClientId, body.ObjectId)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusCreated, createdDeal)
	}
}

func (h *HandlerDeal) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[UpdateDealRequest](&w, r)
		if err != nil {
			return
		}
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		deal, err := h.DealService.Update(uint(id), *body)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusOK, deal)
	}
}

func (h *HandlerDeal) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		err = h.DealService.Delete(uint(id))
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, "deal deleted")
	}
}
