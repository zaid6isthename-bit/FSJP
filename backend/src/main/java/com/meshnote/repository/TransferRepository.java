package com.meshnote.repository;

import com.meshnote.model.Transfer;
import com.meshnote.model.TransferDirection;
import com.meshnote.model.TransferStatus;
import java.util.List;
import java.util.Optional;

public interface TransferRepository {
    Optional<Transfer> findById(String id);
    List<Transfer> findAll();
    List<Transfer> findByStatus(TransferStatus status);
    List<Transfer> findByDirection(TransferDirection direction);
    Transfer save(Transfer transfer);
    Transfer update(Transfer transfer);
    int countActive();
    int countCompleted();
}
