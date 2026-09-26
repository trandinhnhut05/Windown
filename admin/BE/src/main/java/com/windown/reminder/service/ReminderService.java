package com.windown.reminder.service;

import com.windown.common.exception.AppException;
import com.windown.project.entity.Project;
import com.windown.project.repository.ProjectRepository;
import com.windown.reminder.dto.ReminderRequest;
import com.windown.reminder.dto.ReminderResponse;
import com.windown.reminder.entity.Reminder;
import com.windown.reminder.entity.ReminderType;
import com.windown.reminder.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final ProjectRepository projectRepository;

    public List<ReminderResponse> getAllReminders() {
        return reminderRepository.findAllByOrderByRemindAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ReminderResponse> getPendingReminders() {
        return reminderRepository.findByIsDoneFalseOrderByRemindAtAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ReminderResponse create(ReminderRequest request) {
        Project project = null;
        if (request.projectId() != null) {
            project = projectRepository.findById(request.projectId())
                    .orElseThrow(() -> AppException.notFound("Không tìm thấy công trình #" + request.projectId()));
        }

        Reminder reminder = Reminder.builder()
                .title(request.title())
                .remindAt(request.remindAt())
                .type(request.type() != null ? request.type() : ReminderType.OTHER)
                .isDone(request.isDone() != null && request.isDone())
                .project(project)
                .note(request.note())
                .build();

        return toResponse(reminderRepository.save(reminder));
    }

    @Transactional
    public ReminderResponse update(Long id, ReminderRequest request) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy nhắc nhở #" + id));

        Project project = null;
        if (request.projectId() != null) {
            project = projectRepository.findById(request.projectId())
                    .orElseThrow(() -> AppException.notFound("Không tìm thấy công trình #" + request.projectId()));
        }

        reminder.setTitle(request.title());
        reminder.setRemindAt(request.remindAt());
        if (request.type() != null) {
            reminder.setType(request.type());
        }
        if (request.isDone() != null) {
            reminder.setDone(request.isDone());
        }
        reminder.setProject(project);
        reminder.setNote(request.note());

        return toResponse(reminderRepository.save(reminder));
    }

    @Transactional
    public ReminderResponse toggleDone(Long id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy nhắc nhở #" + id));

        reminder.setDone(!reminder.isDone());
        return toResponse(reminderRepository.save(reminder));
    }

    @Transactional
    public void delete(Long id) {
        if (!reminderRepository.existsById(id)) {
            throw AppException.notFound("Không tìm thấy nhắc nhở #" + id);
        }
        reminderRepository.deleteById(id);
    }

    private ReminderResponse toResponse(Reminder r) {
        return new ReminderResponse(
                r.getId(),
                r.getTitle(),
                r.getRemindAt(),
                r.getType(),
                r.isDone(),
                r.getProject() != null ? r.getProject().getId() : null,
                r.getProject() != null ? r.getProject().getName() : null,
                r.getNote(),
                r.getCreatedAt()
        );
    }
}
