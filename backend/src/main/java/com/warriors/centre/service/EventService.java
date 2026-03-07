package com.warriors.centre.service;

import com.warriors.centre.dto.EventRequest;
import com.warriors.centre.dto.EventResponse;
import com.warriors.centre.entity.Event;
import com.warriors.centre.exception.EventNotFoundException;
import com.warriors.centre.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        Event event = new Event();
        mapRequestToEntity(request, event);
        return mapToResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request) {
        // ✅ findByIdWithTags charge tags dans la session
        Event event = eventRepository.findByIdWithTags(id)
                .orElseThrow(() -> new EventNotFoundException(id));
        mapRequestToEntity(request, event);
        return mapToResponse(eventRepository.save(event));
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findByIdWithTags(id)
                .orElseThrow(() -> new EventNotFoundException(id));
        return mapToResponse(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents(String status, String type, String search) {
        List<Event> events;

        if (search != null && !search.trim().isEmpty()) {
            events = eventRepository.searchEvents(search);
        } else {
            // ✅ findAllWithTags au lieu de findAll()
            events = eventRepository.findAllWithTags();
        }

        if (status != null && !status.isEmpty() && !status.equals("all"))
            events = events.stream().filter(e -> status.equals(e.getStatus())).collect(Collectors.toList());

        if (type != null && !type.isEmpty() && !type.equals("all"))
            events = events.stream().filter(e -> type.equals(e.getEventType())).collect(Collectors.toList());

        events.sort((a, b) -> a.getEventDate().compareTo(b.getEventDate()));
        return events.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getUpcomingEvents() {
        return eventRepository
                .findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total",     eventRepository.count());
        stats.put("planned",   eventRepository.countByStatus("Planifi\u00e9"));
        stats.put("ongoing",   eventRepository.countByStatus("En cours"));
        stats.put("finished",  eventRepository.countByStatus("Termin\u00e9"));
        stats.put("cancelled", eventRepository.countByStatus("Annul\u00e9"));
        stats.put("upcoming",  getUpcomingEvents().size());
        stats.put("types",     eventRepository.findAllEventTypes());
        return stats;
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) throw new EventNotFoundException(id);
        eventRepository.deleteById(id);
    }

    private void mapRequestToEntity(EventRequest request, Event event) {
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventType(request.getEventType());
        event.setEventDate(request.getEventDate());
        event.setEndDate(request.getEndDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setLocation(request.getLocation());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setStatus(request.getStatus() != null ? request.getStatus() : "Planifi\u00e9");
        event.setIsPublic(request.getIsPublic() != null ? request.getIsPublic() : true);
        event.setEntryFee(request.getEntryFee() != null ? request.getEntryFee() : 0.0);
        event.setOrganizerName(request.getOrganizerName());
        event.setCoverEmoji(request.getCoverEmoji() != null ? request.getCoverEmoji() : "\uD83D\uDCC5");
        event.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());
    }

    private EventResponse mapToResponse(Event event) {
        EventResponse r = new EventResponse();
        r.setId(event.getId());
        r.setTitle(event.getTitle());
        r.setDescription(event.getDescription());
        r.setEventType(event.getEventType());
        r.setEventDate(event.getEventDate());
        r.setEndDate(event.getEndDate());
        r.setStartTime(event.getStartTime());
        r.setEndTime(event.getEndTime());
        r.setLocation(event.getLocation());
        r.setMaxParticipants(event.getMaxParticipants());
        r.setRegisteredCount(event.getRegisteredCount());
        r.setStatus(event.getStatus());
        r.setIsPublic(event.getIsPublic());
        r.setEntryFee(event.getEntryFee());
        r.setOrganizerName(event.getOrganizerName());
        r.setCoverEmoji(event.getCoverEmoji());
        r.setTags(event.getTags()); // ✅ safe — EAGER ou dans transaction
        r.setCreatedAt(event.getCreatedAt());
        r.setUpdatedAt(event.getUpdatedAt());
        return r;
    }
}