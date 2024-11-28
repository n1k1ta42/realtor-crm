package eventbus

const (
	UserCreated = "user created"
	UserUpdated = "user updated"
	UserDeleted = "user deleted"
)

type Event struct {
	Type string
	Data map[string]interface{}
}

type BusEvent struct {
	bus chan Event
}

func NewEventBus() *BusEvent {
	return &BusEvent{
		bus: make(chan Event),
	}
}

func (b *BusEvent) Publish(event Event) {
	b.bus <- event
}

func (b *BusEvent) Subscribe() <-chan Event {
	return b.bus
}
