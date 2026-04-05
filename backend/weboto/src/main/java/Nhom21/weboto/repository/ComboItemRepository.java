package Nhom21.weboto.repository;

import Nhom21.weboto.entity.Combo;
import Nhom21.weboto.entity.ComboItem;
import Nhom21.weboto.entity.ComboItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboItemRepository extends JpaRepository<ComboItem, ComboItemId> {
    List<ComboItem> findByComboOrderBySortOrderAsc(Combo combo);

    void deleteByCombo(Combo combo);

    @Query("SELECT ci FROM ComboItem ci JOIN FETCH ci.combo c JOIN FETCH ci.part p WHERE c.active = true AND p.id = :partId ORDER BY c.id DESC, ci.sortOrder ASC")
    List<ComboItem> findActiveItemsByPartId(@Param("partId") Integer partId);
}
