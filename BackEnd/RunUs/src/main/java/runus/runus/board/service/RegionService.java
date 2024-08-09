package runus.runus.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import runus.runus.api.NotFoundElementException;
import runus.runus.board.dto.RegionMajorDTO;
import runus.runus.board.dto.RegionMinorDTO;
import runus.runus.board.entity.RegionMajor;
import runus.runus.board.entity.RegionMinor;
import runus.runus.board.repository.RegionMajorRepository;
import runus.runus.board.repository.RegionMinorRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegionService {
    @Autowired
    private RegionMajorRepository regionMajorRepository;

    @Autowired
    private RegionMinorRepository regionMinorRepository;

    public List<RegionMajorDTO> getAllMajorRegions() {
        List<RegionMajor> majorRegions = regionMajorRepository.findAll();
        return majorRegions.stream()
                .map(region -> new RegionMajorDTO(region.getRegionMajorId(), region.getRegionMajorName()))
                .collect(Collectors.toList());
    }

    public List<RegionMinorDTO> getMinorRegionsByMajorId(int majorId) {
        List<RegionMinor> minorRegions = regionMinorRepository.findByParentId(majorId);
        return minorRegions.stream()
                .map(region -> new RegionMinorDTO(region.getRegionMinorId(), region.getRegionMinorName(), region.getParentId()))
                .collect(Collectors.toList());
    }

    // 기존 메서드를 수정
    public RegionMinorDTO getMajorRegionByMinorId(int minorId) {
        RegionMinor regionMinor = regionMinorRepository.findById(minorId)
                .orElseThrow(() -> new NotFoundElementException("Region not found"));
        return new RegionMinorDTO(regionMinor.getRegionMinorId(), regionMinor.getRegionMinorName(), regionMinor.getParentId());
    }
}
