package com.meshnote.repository;

import com.meshnote.model.SharedFile;
import java.util.List;
import java.util.Optional;

public interface SharedFileRepository {
    Optional<SharedFile> findById(String id);
    List<SharedFile> findAll();
    List<SharedFile> findAllShared();
    SharedFile save(SharedFile file);
    SharedFile update(SharedFile file);
    void deleteById(String id);
    int countShared();
    void incrementAccessCount(String id);
    List<SharedFile> search(String query);
}
