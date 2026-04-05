package Nhom21.weboto.service;

import Nhom21.weboto.dto.ComboDto;
import Nhom21.weboto.entity.Combo;
import Nhom21.weboto.entity.ComboItem;
import Nhom21.weboto.entity.Part;
import Nhom21.weboto.exception.ResourceNotFoundException;
import Nhom21.weboto.repository.ComboItemRepository;
import Nhom21.weboto.repository.ComboRepository;
import Nhom21.weboto.repository.PartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ComboService {

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private ComboItemRepository comboItemRepository;

    @Autowired
    private PartRepository partRepository;

    public List<ComboDto> findAll() {
        return comboRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public List<ComboDto> findActiveCombos() {
        return comboRepository.findByActiveTrueOrderByIdDesc().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public ComboDto findActiveById(Integer id) {
        Combo combo = comboRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy combo đang hoạt động ID: " + id));
        return mapEntityToDto(combo);
    }

    public List<ComboDto> findActiveCombosByPart(Integer partId) {
        List<ComboItem> comboItems = comboItemRepository.findActiveItemsByPartId(partId);
        Map<Integer, Combo> combos = new LinkedHashMap<>();
        for (ComboItem item : comboItems) {
            combos.putIfAbsent(item.getCombo().getId(), item.getCombo());
        }
        return combos.values().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComboDto save(ComboDto dto) {
        Combo combo = new Combo();
        mapDtoToEntity(dto, combo);
        Combo savedCombo = comboRepository.save(combo);
        replaceItems(savedCombo, dto.getItems());
        return mapEntityToDto(savedCombo);
    }

    @Transactional
    public ComboDto update(Integer id, ComboDto dto) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy combo ID: " + id));
        mapDtoToEntity(dto, combo);
        Combo savedCombo = comboRepository.save(combo);
        replaceItems(savedCombo, dto.getItems());
        return mapEntityToDto(savedCombo);
    }

    @Transactional
    public ComboDto setActive(Integer id, Boolean active) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy combo ID: " + id));
        combo.setActive(active);
        return mapEntityToDto(comboRepository.save(combo));
    }

    private void mapDtoToEntity(ComboDto dto, Combo combo) {
        combo.setName(dto.getName());
        combo.setSlug(dto.getSlug());
        combo.setDescription(dto.getDescription());
        combo.setImageUrl(dto.getImageUrl());
        combo.setDiscountType(dto.getDiscountType() == null ? "PERCENT" : dto.getDiscountType());
        combo.setDiscountValue(dto.getDiscountValue() == null ? java.math.BigDecimal.ZERO : dto.getDiscountValue());
        combo.setActive(dto.getActive() == null ? Boolean.TRUE : dto.getActive());
    }

    private void replaceItems(Combo combo, List<ComboDto.ComboItemDto> itemDtos) {
        comboItemRepository.deleteByCombo(combo);
        if (itemDtos == null || itemDtos.isEmpty()) {
            return;
        }

        List<ComboItem> items = new ArrayList<>();
        for (ComboDto.ComboItemDto itemDto : itemDtos) {
            Part part = partRepository.findById(itemDto.getPartId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phụ tùng ID: " + itemDto.getPartId()));

            ComboItem item = new ComboItem();
            item.setCombo(combo);
            item.setPart(part);
            item.setQuantity(itemDto.getQuantity() == null ? 1 : itemDto.getQuantity());
            item.setSortOrder(itemDto.getSortOrder() == null ? 0 : itemDto.getSortOrder());
            items.add(item);
        }
        comboItemRepository.saveAll(items);
    }

    private ComboDto mapEntityToDto(Combo combo) {
        List<ComboDto.ComboItemDto> items = comboItemRepository.findByComboOrderBySortOrderAsc(combo).stream()
                .map(item -> new ComboDto.ComboItemDto(
                        item.getPart().getId(),
                        item.getPart().getName(),
                        item.getQuantity(),
                        item.getSortOrder(),
                        item.getPart().getImageUrl(),
                        item.getPart().getPrice()
                ))
                .collect(Collectors.toList());

        return new ComboDto(
                combo.getId(),
                combo.getName(),
                combo.getSlug(),
                combo.getDescription(),
                combo.getImageUrl(),
                combo.getDiscountType(),
                combo.getDiscountValue(),
                combo.getActive(),
                items
        );
    }

    public void delete(Integer id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy combo ID: " + id));
        comboItemRepository.deleteByCombo(combo);
        comboRepository.delete(combo);
    }
}
