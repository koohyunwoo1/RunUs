package runus.runus.record.mapper;

import runus.runus.record.dto.RecordDTO;
import runus.runus.record.model.Record;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class RecordMapper {

    // DTO to Entity
    public static Record toEntity(RecordDTO recordDTO) {
        if (recordDTO == null) {
            return null;
        }

        Record record = new Record();
        record.setRecord_id(recordDTO.getRecord_id());
        record.setUser_id(recordDTO.getUser_id());
        record.setParty_id(recordDTO.getParty_id());
        record.setDistance(recordDTO.getDistance());
        record.setTime(recordDTO.getTime());
        record.setKcal(recordDTO.getKcal());

        if (recordDTO.getRecord_date() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            record.setRecord_date(LocalDateTime.parse(recordDTO.getRecord_date(), formatter));
        }

        return record;
    }

    // Entity to DTO
    public static RecordDTO toDTO(Record record) {
        if (record == null) {
            return null;
        }

        RecordDTO recordDTO = new RecordDTO();
        recordDTO.setRecord_id(record.getRecord_id());
        recordDTO.setUser_id(record.getUser_id());
        recordDTO.setParty_id(record.getParty_id());
        recordDTO.setDistance(record.getDistance());
        recordDTO.setTime(record.getTime());
        recordDTO.setKcal(record.getKcal());

        if (record.getRecord_date() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            recordDTO.setRecord_date(record.getRecord_date().format(formatter));
        }

        return recordDTO;
    }
}
