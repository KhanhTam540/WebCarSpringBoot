package Nhom21.weboto.repository;

import Nhom21.weboto.entity.FavoriteItem;
import Nhom21.weboto.entity.Part;
import Nhom21.weboto.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteItemRepository extends JpaRepository<FavoriteItem, Integer> {
    List<FavoriteItem> findByUserAndActiveTrue(User user);

    Optional<FavoriteItem> findByUserAndPart(User user, Part part);
}
