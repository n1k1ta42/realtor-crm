package client

import (
	"log"
	"net/http"
	"realtor-crm-backend/configs"
	"realtor-crm-backend/pkg/middleware"
	"realtor-crm-backend/pkg/req"
	"realtor-crm-backend/pkg/res"
	"strconv"
)

type HandlerClientDeps struct {
	ClientRepository *RepositoryClient
	ClientService    *ServiceClient
	Config           *configs.Config
}

type HandlerClient struct {
	ClientRepository *RepositoryClient
	ClientService    *ServiceClient
}

func NewHandlerClients(router *http.ServeMux, deps HandlerClientDeps) {
	handler := &HandlerClient{
		ClientRepository: deps.ClientRepository,
		ClientService:    deps.ClientService,
	}
	router.Handle("GET /client/list", middleware.IsAuthed(handler.List(), deps.Config))
	router.Handle("GET /client/{id}", middleware.IsAuthed(handler.ById(), deps.Config))
	router.Handle("POST /client", middleware.IsAuthed(handler.Create(), deps.Config))
	router.Handle("PATCH /client/{id}", middleware.IsAuthed(handler.Update(), deps.Config))
	router.Handle("DELETE /client/{id}", middleware.IsAuthed(handler.Delete(), deps.Config))
}

func (h *HandlerClient) List() http.HandlerFunc {
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
		list, err := h.ClientService.List(limit, offset)
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, list)
	}
}

func (h *HandlerClient) ById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		client, err := h.ClientRepository.ById(uint(id))
		if err != nil {
			res.Json(w, http.StatusNotFound, "client not found")
			return
		}
		res.Json(w, http.StatusOK, client)
	}
}

func (h *HandlerClient) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[CreateClientRequest](&w, r)
		if err != nil {
			return
		}
		creatorId, ok := r.Context().Value(middleware.ContextIdKey).(uint)
		if !ok {
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		createdClient, err := h.ClientService.Create(body.Name, body.Surname, body.Email, body.Phone, body.Address, body.Notes, creatorId)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusCreated, createdClient)
	}
}

func (h *HandlerClient) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[UpdateClientRequest](&w, r)
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
		client, err := h.ClientService.Update(uint(id), *body)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusOK, client)
	}
}

func (h *HandlerClient) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		err = h.ClientService.Delete(uint(id))
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, "client deleted")
	}
}
