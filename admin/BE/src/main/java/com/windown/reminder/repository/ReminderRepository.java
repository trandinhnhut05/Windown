package com.windown.reminder.repository;

import com.windown.reminder.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByIsDoneFalseOrderByRemindAtAsc();
    List<Reminder> findByRemindAtBetweenOrderByRemindAtAsc(LocalDateTime start, LocalDateTime end);
    List<Reminder> findAllByOrderByRemindAtDesc();
}
