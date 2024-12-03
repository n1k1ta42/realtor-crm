package user

import (
	"log"
	"net/http"
	"realtor-crm-backend/configs"
	"realtor-crm-backend/pkg/middleware"
	"realtor-crm-backend/pkg/req"
	"realtor-crm-backend/pkg/res"
	"strconv"
)

type HandlerUserDeps struct {
	UserRepository *RepositoryUser
	UserService    *ServiceUser
	Config         *configs.Config
}

type HandlerUser struct {
	UserRepository *RepositoryUser
	UserService    *ServiceUser
}

func NewHandlerUsers(router *http.ServeMux, deps HandlerUserDeps) {
	handler := &HandlerUser{
		UserRepository: deps.UserRepository,
		UserService:    deps.UserService,
	}
	router.Handle("GET /user/profile", middleware.IsAuthed(handler.Profile(), deps.Config))
	router.Handle("GET /user/list", middleware.IsAuthed(handler.List(), deps.Config))
	router.Handle("GET /user/{email}", middleware.IsAuthed(handler.ByEmail(), deps.Config))
	router.Handle("POST /user", middleware.IsAuthed(handler.Create(), deps.Config))
	router.Handle("PATCH /user/{id}", middleware.IsAuthed(handler.Update(), deps.Config))
	router.Handle("DELETE /user/{id}", middleware.IsAuthed(handler.Delete(), deps.Config))
}

func (h *HandlerUser) Profile() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userId, ok := r.Context().Value(middleware.ContextIdKey).(uint)
		if !ok {
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		profile, err := h.UserRepository.ById(userId)
		if err != nil {
			res.Json(w, http.StatusNotFound, "user not found")
			return
		}
		res.Json(w, http.StatusOK, profile)
	}
}

func (h *HandlerUser) List() http.HandlerFunc {
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
		orderBy := r.URL.Query().Get("orderBy")
		if orderBy == "" {
			orderBy = "id"
		}
		direction := r.URL.Query().Get("direction")
		if direction == "" {
			direction = "asc"
		}
		organizationId, _ := strconv.Atoi(r.URL.Query().Get("organizationId"))
		if err != nil {
			log.Println(err.Error())
		}
		list, err := h.UserService.List(limit, offset, organizationId, orderBy, direction)
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, list)
	}
}

func (h *HandlerUser) ByEmail() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.PathValue("email")
		user, err := h.UserRepository.ByEmail(email)
		if err != nil {
			res.Json(w, http.StatusNotFound, "user not found")
			return
		}
		res.Json(w, http.StatusOK, user)
	}
}

func (h *HandlerUser) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[CreateUserRequest](&w, r)
		if err != nil {
			return
		}
		creatorId, ok := r.Context().Value(middleware.ContextIdKey).(uint)
		if !ok {
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		createdPassword, err := h.UserService.Create(body.Name, body.Surname, body.Email, body.Role, creatorId)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusCreated, createdPassword)
	}
}

func (h *HandlerUser) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[UpdateUserRequest](&w, r)
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
		creatorId, ok := r.Context().Value(middleware.ContextIdKey).(uint)
		if !ok {
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		user, err := h.UserService.Update(uint(id), *body, creatorId)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		res.Json(w, http.StatusOK, user)
	}
}

func (h *HandlerUser) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idString := r.PathValue("id")
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			log.Println(err.Error())
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		creatorId, ok := r.Context().Value(middleware.ContextIdKey).(uint)
		if !ok {
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		err = h.UserService.Delete(uint(id), creatorId)
		if err != nil {
			res.Json(w, http.StatusInternalServerError, err.Error())
			return
		}
		res.Json(w, http.StatusOK, "user deleted")
	}
}
