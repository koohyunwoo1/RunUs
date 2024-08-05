package runus.runus.board.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "region_minor")
public class RegionMinor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int regionMinorId;
    private String regionMinorName;
    private int parentId;

    // Getters and setters
    public int getRegionMinorId() {
        return regionMinorId;
    }

    public void setRegionMinorId(int regionMinorId) {
        this.regionMinorId = regionMinorId;
    }

    public String getRegionMinorName() {
        return regionMinorName;
    }

    public void setRegionMinorName(String regionMinorName) {
        this.regionMinorName = regionMinorName;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }
}
