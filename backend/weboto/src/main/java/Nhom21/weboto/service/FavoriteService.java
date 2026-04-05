package Nhom21.weboto.service;

import Nhom21.weboto.dto.FavoriteItemDto;
import Nhom21.weboto.entity.FavoriteItem;
import Nhom21.weboto.entity.Part;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.repository.FavoriteItemRepository;
import Nhom21.weboto.repository.PartRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {
    @Autowired
    private FavoriteItemRepository favoriteItemRepository;

    @Autowired
    private PartRepository partRepository;

    public List<FavoriteItemDto> getFavorites(User user) {
        return favoriteItemRepository.findByUserAndActiveTrue(user).stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public FavoriteItemDto addFavorite(User user, Integer partId) {
        Part part = partRepository.findById(partId)
                .orElseThrow(() -> new RuntimeException("Phụ tùng không tồn tại"));

        FavoriteItem favoriteItem = favoriteItemRepository.findByUserAndPart(user, part)
                .orElseGet(FavoriteItem::new);

        favoriteItem.setUser(user);
        favoriteItem.setPart(part);
        favoriteItem.setActive(true);

        return mapToDto(favoriteItemRepository.save(favoriteItem));
    }

    @Transactional
    public void removeFavorite(User user, Integer partId) {
        Part part = partRepository.findById(partId)
                .orElseThrow(() -> new RuntimeException("Phụ tùng không tồn tại"));

        favoriteItemRepository.findByUserAndPart(user, part)
                .ifPresent(item -> {
                    item.setActive(false);
                    favoriteItemRepository.save(item);
                });
    }

    private FavoriteItemDto mapToDto(FavoriteItem item) {
        return new FavoriteItemDto(
                item.getId(),
                item.getPart().getId(),
                item.getPart().getSku(),
                item.getPart().getName(),
                item.getPart().getPrice(),
                item.getPart().getStockQuantity(),
                item.getPart().getImageUrl(),
                item.getPart().getCategory() != null ? item.getPart().getCategory().getId() : null,
                item.getPart().getCategory() != null ? item.getPart().getCategory().getName() : null
        );
    }
}
