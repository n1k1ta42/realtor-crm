package auth

import (
	"net/http"
	"realtor-crm-backend/configs"
	JWT "realtor-crm-backend/pkg/jwt"
	"realtor-crm-backend/pkg/req"
	"realtor-crm-backend/pkg/res"
)

type HandlerAuthDeps struct {
	*configs.Config
	AuthService *ServiceAuth
}

type HandlerAuth struct {
	*configs.Config
	AuthService *ServiceAuth
}

func NewHandlerAuth(router *http.ServeMux, deps HandlerAuthDeps) {
	handler := &HandlerAuth{
		Config:      deps.Config,
		AuthService: deps.AuthService,
	}
	router.HandleFunc("POST /auth/login", handler.Login())
}

func (h *HandlerAuth) Login() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := req.HandleBody[LoginRequest](&w, r)
		if err != nil {
			return
		}
		user, err := h.AuthService.Login(body.Email, body.Password)
		if err != nil {
			res.Json(w, http.StatusBadRequest, err.Error())
			return
		}
		token, err := JWT.NewJWT(h.Config.Auth.Secret).CreateToken(JWT.DataJWT{Id: user.ID, Role: user.Role})
		if err != nil {
			res.Json(w, http.StatusInternalServerError, "something went wrong")
			return
		}
		data := LoginResponse{
			Token: token,
		}
		res.Json(w, http.StatusOK, data)
	}
}
