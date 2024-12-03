package middleware

import (
	"context"
	"net/http"
	"realtor-crm-backend/configs"
	JWT "realtor-crm-backend/pkg/jwt"
	"strings"
)

type key string

const (
	ContextIdKey   key = "ContextIdKey"
	ContextRoleKey key = "ContextRoleKey"
)

func WriteUnauthorized(w http.ResponseWriter, statusCode int) {
	w.WriteHeader(statusCode)
	w.Write([]byte("unauthorized"))
}

func IsAuthed(next http.Handler, config *configs.Config) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			WriteUnauthorized(w, http.StatusForbidden)
			return
		}
		token := strings.TrimPrefix(authHeader, "Bearer ")
		isValid, data := JWT.NewJWT(config.Auth.Secret).VerifyToken(token)
		if !isValid {
			WriteUnauthorized(w, http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), ContextIdKey, data.Id)
		ctx = context.WithValue(ctx, ContextRoleKey, data.Role)
		req := r.WithContext(ctx)
		next.ServeHTTP(w, req)
	})
}
