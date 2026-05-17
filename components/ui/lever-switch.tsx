"use client";

const CSS = `
.toggle-container {
  position: relative;
  width: 60px;
  height: 100px;
  cursor: pointer;
}
.toggle-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 10;
  margin: 0;
}
.toggle-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 20px;
  background: #333;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
}
.toggle-base-inside {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 8px;
  background: #222;
  border-radius: 2px;
}
.toggle-handle-wrapper {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 70px;
  transform-origin: bottom center;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle-input:checked ~ .toggle-handle-wrapper {
  transform: translateX(-50%) rotate(-35deg);
}
.toggle-handle {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.toggle-handle-knob {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #ff4444, #aa0000);
  box-shadow: 0 2px 8px rgba(255,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3);
  flex-shrink: 0;
}
.toggle-handle-bar-wrapper {
  flex: 1;
  width: 8px;
  display: flex;
  justify-content: center;
}
.toggle-handle-bar {
  width: 8px;
  height: 100%;
  background: linear-gradient(to right, #888, #ccc, #888);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.4);
}
`;

interface LeverSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function LeverSwitch({ checked, onChange }: LeverSwitchProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <label className="toggle-container">
        <input
          type="checkbox"
          className="toggle-input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="toggle-base">
          <div className="toggle-base-inside" />
        </div>
        <div className="toggle-handle-wrapper">
          <div className="toggle-handle">
            <div className="toggle-handle-knob" />
            <div className="toggle-handle-bar-wrapper">
              <div className="toggle-handle-bar" />
            </div>
          </div>
        </div>
      </label>
    </>
  );
}
