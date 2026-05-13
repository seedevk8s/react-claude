// ✏️ Thymeleaf에는 없는 개념 — React에서 상태로 모달 표시/숨김 제어
// 불가역 작업(삭제) 전 반드시 사용자 확인을 받는 UX 패턴

export default function ConfirmModal({ title = '확인', message, onConfirm, onCancel }) {
  return (
    // ✏️ modal-overlay: 화면 전체를 어둡게 덮는 반투명 배경
    <div className="modal-overlay" onClick={onCancel}>
      {/* ✏️ 클릭 이벤트 버블링 방지: 모달 박스 클릭 시 닫히지 않도록 */}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>
            취소
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
