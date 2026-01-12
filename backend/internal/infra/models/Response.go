package models

type RequestBody[T any] struct {
	Body T
}
type ResponseMeta struct {
	Key   string `json:"key"`
	Value any    `json:"value"`
}
type APIResponse[T any] struct {
	Data    *T              `json:"data,omitempty"`
	Message string          `json:"message"`
	Meta    *[]ResponseMeta `json:"meta,omitempty"`
}
type Response[T any] struct {
	Body *APIResponse[T] `json:"body,omitempty"`
}

func NewResponse[T any](message string) *Response[T] {
	return &Response[T]{
		Body: &APIResponse[T]{
			Message: message,
		},
	}
}
func (r *Response[T]) SetData(data *T) *Response[T] {
	if r.Body.Data != nil {
		return r
	}
	r.Body.Data = data
	return r
}
func (r *Response[T]) AddMeta(key string, value any) *Response[T] {
	if r.Body.Meta == nil {
		r.Body.Meta = &[]ResponseMeta{{Key: key, Value: value}}
		return r
	}
	*r.Body.Meta = append(*r.Body.Meta, ResponseMeta{Key: key, Value: value})
	return r
}
func (r *Response[T]) SetMeta(meta []ResponseMeta) *Response[T] {
	if len(meta) == 0 {
		return r
	}
	r.Body.Meta = &meta
	return r
}
