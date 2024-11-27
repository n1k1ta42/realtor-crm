package object

import (
	"log"
	"net/http"
	"realtor-crm-backend/configs"
	"realtor-crm-backend/pkg/middleware"
	"realtor-crm-backend/pkg/req"
	"realtor-crm-backend/pkg/res"
	"strconv"
)

type HandlerObjectDeps struct {
	ObjectRepository *RepositoryObject
	ObjectService    *ServiceObject
	Config           *configs.Config
}

type HandlerObject struct {
	ObjectRepository *RepositoryObject
	ObjectService    *ServiceObject
}

func NewHandlerObjects(router *http.ServeMux, deps HandlerObjectDeps) {
	handler := &HandlerObject{
		ObjectRepository: deps.ObjectRepository,
		ObjectService:    deps.ObjectService,
	}
	router.Handle("GET /object/list", middleware.IsAuthed(handler.List(), deps.Config))
	router.Handle("GET /object/{id}", middleware.IsAuthed(handler.ById(), deps.Config))
	router.Handle("POST /object", middleware.IsAuthed(handler.Create(), deps.Config))
	router.Handle("PATCH /object/{id}", middleware.IsAuthed(handler.Update(), deps.Config))
	router.Handle("DELETE /object/{id}", middleware.IsAuthed(handler.Delete(), deps.Config))
}

func (h *HandlerObject) List() http.HandlerFunc {
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
		list, err := h.ObjectService.List(limit, offset)
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, list)
	}
}

func (h *HandlerObject) ById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		object, err := h.ObjectRepository.ById(uint(id))
		if err != nil {
			res.Json(w, http.StatusNotFound, "object not found")
			return
		}
		res.Json(w, http.StatusOK, object)
	}
}

func (h *HandlerObject) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[CreateObjectRequest](&w, r)
		if err != nil {
			return
		}
		creatorId, ok := r.Context().Value(middleware.ContextIdKey).(uint)
		if !ok {
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		createdObject, err := h.ObjectService.Create(body.Title, body.Description, body.Address, body.ObjectType, body.Status, body.Price, creatorId)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusCreated, createdObject)
	}
}

func (h *HandlerObject) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[UpdateObjectRequest](&w, r)
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
		object, err := h.ObjectService.Update(uint(id), *body)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusOK, object)
	}
}

func (h *HandlerObject) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		err = h.ObjectService.Delete(uint(id))
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, "object deleted")
	}
}
