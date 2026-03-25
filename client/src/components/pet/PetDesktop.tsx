import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { SpeechBubble } from "./SpeechBubble";

// ==================== 常量配置 ====================
const CAT_SIZE = 72;
const SPRING_CONFIG = { damping: 30, stiffness: 150, mass: 0.9 };
const SPEECH_DURATION = 2500;

// 台词配置
const SPEECH_LINES = [
  "喵喵，你好呀！",
  "今天也要加油！",
  "别偷懒啦~",
  "我在盯着你",
  "要不要休息一下？",
  "好无聊哦...",
  "摸摸我嘛~",
  "抱抱！",
  "肚子饿了",
  "今天天气真好",
  "好困啊...",
  "陪我玩嘛！",
  "嘿嘿~",
  "好开心呀！",
  "等等我！",
];

// 情绪配置
type Mood = "happy" | "normal" | "bored";

interface MoodConfig {
  emoji: string;
  scale: number;
  rotation: number;
}

const MOOD_CONFIG: Record<Mood, MoodConfig> = {
  happy: { emoji: "😸", scale: 1.15, rotation: 0 },
  normal: { emoji: "😺", scale: 1.0, rotation: 0 },
  bored: { emoji: "😿", scale: 0.9, rotation: -5 },
};

export default function PetDesktop() {
  const [xPercent, setXPercent] = useState(() => Math.random() * 70 + 10);
  const [yPercent, setYPercent] = useState(() => Math.random() * 70 + 10);

  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, SPRING_CONFIG);
  const y = useSpring(yRaw, SPRING_CONFIG);

  // 气泡状态
  const [speechText, setSpeechText] = useState("");
  const [speechVisible, setSpeechVisible] = useState(false);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 情绪
  const [mood, setMood] = useState<Mood>("normal");
  const lastInteractionRef = useRef(Date.now());

  // 各种定时器
  const dodgeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moodResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boredomTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 互斥锁：防止躲避和随机移动同时触发
  const moveLockRef = useRef(false);

  // 记录互动 -> 开心
  const recordInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
    if (moodResetRef.current) clearTimeout(moodResetRef.current);
    setMood("happy");
    moodResetRef.current = setTimeout(() => setMood("normal"), 3000);
  }, []);

  // 显示台词
  const showSpeech = useCallback((text?: string) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    const line = text ?? SPEECH_LINES[Math.floor(Math.random() * SPEECH_LINES.length)];
    setSpeechText(line);
    setSpeechVisible(true);
    speechTimerRef.current = setTimeout(() => setSpeechVisible(false), SPEECH_DURATION);
  }, []);

  // 同步百分比 -> 像素坐标
  const syncPixelPosition = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    xRaw.set((xPercent / 100) * (vw - CAT_SIZE));
    yRaw.set((yPercent / 100) * (vh - CAT_SIZE));
  }, [xPercent, yPercent, xRaw, yRaw]);

  // 随机移动（带互斥锁）
  const moveToRandomPosition = useCallback(() => {
    if (moveLockRef.current) return;
    const nx = Math.random() * 72 + 8;
    const ny = Math.random() * 72 + 8;
    setXPercent(nx);
    setYPercent(ny);
    showSpeech();
  }, [showSpeech]);

  // 躲避鼠标（带互斥锁 + 冷却）
  const dodgeMouse = useCallback(
    (clientX: number, clientY: number) => {
      if (moveLockRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const catPixelX = (xPercent / 100) * (vw - CAT_SIZE) + CAT_SIZE / 2;
      const catPixelY = (yPercent / 100) * (vh - CAT_SIZE) + CAT_SIZE / 2;
      const dist = Math.hypot(clientX - catPixelX, clientY - catPixelY);
      if (dist < 130) {
        if (dodgeTimeoutRef.current) clearTimeout(dodgeTimeoutRef.current);
        moveLockRef.current = true;
        dodgeTimeoutRef.current = setTimeout(() => { moveLockRef.current = false; }, 700);

        const angle = Math.atan2(catPixelY - clientY, catPixelX - clientX);
        const shiftVW = (15 + Math.random() * 10) / (vw / 100);
        const shiftVH = (15 + Math.random() * 10) / (vh / 100);
        const nx = Math.max(3, Math.min(90, xPercent + Math.cos(angle) * shiftVW));
        const ny = Math.max(3, Math.min(90, yPercent + Math.sin(angle) * shiftVH));
        setXPercent(nx);
        setYPercent(ny);
        showSpeech("咦！");
      }
    },
    [xPercent, yPercent, showSpeech],
  );

  // 点击 -> 台词 + 开心
  const handleClick = useCallback(() => {
    recordInteraction();
    showSpeech();
  }, [recordInteraction, showSpeech]);

  // 无聊时靠近鼠标
  const approachMouse = useCallback(() => {
    if (moveLockRef.current) return;
    const nx = Math.max(5, Math.min(85, xPercent + (Math.random() - 0.5) * 8));
    const ny = Math.max(5, Math.min(85, yPercent + (Math.random() - 0.5) * 8));
    setXPercent(nx);
    setYPercent(ny);
    showSpeech("陪我玩嘛！");
  }, [xPercent, yPercent, showSpeech]);

  // 监听鼠标
  useEffect(() => {
    const onMove = (e: MouseEvent) => dodgeMouse(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [dodgeMouse]);

  // 窗口 resize
  useEffect(() => {
    syncPixelPosition();
    const onResize = () => syncPixelPosition();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncPixelPosition]);

  // 百分比变化 -> 立即同步像素
  useEffect(() => { syncPixelPosition(); }, [xPercent, yPercent, syncPixelPosition]);

  // 随机移动定时器
  useEffect(() => {
    const scheduleNextMove = () => {
      const delay = 2000 + Math.random() * 3000;
      moveTimerRef.current = setTimeout(() => {
        moveToRandomPosition();
        scheduleNextMove();
      }, delay);
    };
    scheduleNextMove();
    return () => { if (moveTimerRef.current) clearTimeout(moveTimerRef.current); };
  }, [moveToRandomPosition]);

  // 无聊检测
  useEffect(() => {
    const checkBoredom = () => {
      const idle = Date.now() - lastInteractionRef.current;
      if (idle > 15000 && mood !== "bored") {
        setMood("bored");
        approachMouse();
      }
    };
    boredomTimerRef.current = setInterval(checkBoredom, 5000);
    return () => { if (boredomTimerRef.current) clearInterval(boredomTimerRef.current); };
  }, [mood, approachMouse]);

  // 清理
  useEffect(() => {
    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (dodgeTimeoutRef.current) clearTimeout(dodgeTimeoutRef.current);
      if (moodResetRef.current) clearTimeout(moodResetRef.current);
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
      if (boredomTimerRef.current) clearInterval(boredomTimerRef.current);
    };
  }, []);

  const moodCfg = MOOD_CONFIG[mood];

  return (
    <motion.div
      style={{
        x,
        y,
        left: 0,
        top: 0,
        position: "fixed",
        zIndex: 9999,
      }}
      className="cursor-pointer select-none"
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      animate={
        mood === "happy"
          ? {
              scale: [1, 1.25, 0.9, 1.15, 1],
              rotate: [0, -8, 8, -5, 0],
              transition: { duration: 0.6, ease: "easeInOut" },
            }
          : mood === "bored"
            ? {
                scale: [1, 0.88, 1.05],
                rotate: [0, -4, 4, 0],
                transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity },
              }
            : {
                scale: moodCfg.scale,
                rotate: moodCfg.rotation,
                transition: { type: "spring" as const, ...SPRING_CONFIG },
              }
      }
    >
      <div className="relative flex flex-col items-center">
        {/* 气泡 */}
        <SpeechBubble text={speechText} visible={speechVisible} />

        {/* 橘猫本体 */}
        <motion.div
          className="relative"
          animate={
            mood === "bored"
              ? { y: [0, -4, 0], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }
              : mood === "happy"
                ? {}
                : { y: [0, -3, 0], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }
          }
        >
          {/* 猫身体 */}
          <div
            className="relative flex items-center justify-center rounded-full shadow-xl"
            style={{
              width: CAT_SIZE,
              height: CAT_SIZE,
              background: "linear-gradient(145deg, #ffb347 0%, #ff8c00 100%)",
              boxShadow: "0 6px 20px rgba(255,140,0,0.4), 0 2px 6px rgba(0,0,0,0.1), inset 0 -4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {/* 肚子 */}
            <div
              className="absolute rounded-full"
              style={{
                width: 30,
                height: 26,
                background: "rgba(255,255,255,0.35)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -30%)",
              }}
            />
            {/* 左耳 */}
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "16px solid #ff8c00",
                top: -2,
                left: 10,
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
              }}
            />
            {/* 右耳 */}
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "16px solid #ff8c00",
                top: -2,
                right: 10,
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
              }}
            />
            {/* 左眼 */}
            <motion.div
              className="absolute bg-zinc-900 rounded-full"
              style={{ width: 10, height: 12, top: "35%", left: "22%" }}
              animate={
                mood === "bored"
                  ? { scaleY: [1, 0.2, 1] }
                  : mood === "happy"
                    ? { scaleY: [1, 0.1, 1], scaleX: [1, 1.3, 1] }
                    : { scaleY: [1, 0.7, 1] }
              }
              transition={{ duration: mood === "happy" ? 0.3 : 3.5, repeat: Infinity, repeatDelay: 1.5 }}
            />
            {/* 右眼 */}
            <motion.div
              className="absolute bg-zinc-900 rounded-full"
              style={{ width: 10, height: 12, top: "35%", right: "22%" }}
              animate={
                mood === "bored"
                  ? { scaleY: [1, 0.2, 1] }
                  : mood === "happy"
                    ? { scaleY: [1, 0.1, 1], scaleX: [1, 1.3, 1] }
                    : { scaleY: [1, 0.7, 1] }
              }
              transition={{ duration: mood === "happy" ? 0.3 : 3.5, repeat: Infinity, repeatDelay: 1.8 }}
            />
            {/* 眼珠高光 */}
            <div className="absolute bg-white rounded-full" style={{ width: 4, height: 4, top: "34%", left: "25%" }} />
            <div className="absolute bg-white rounded-full" style={{ width: 4, height: 4, top: "34%", right: "25%" }} />
            {/* 鼻子 */}
            <div
              className="absolute bg-pink-400 rounded-full"
              style={{ width: 6, height: 5, top: "54%", left: "50%", transform: "translateX(-50%)" }}
            />
            {/* 嘴巴 */}
            <svg
              className="absolute"
              style={{ top: "57%", left: "50%", transform: "translateX(-50%)" }}
              width="16"
              height="10"
              viewBox="0 0 16 10"
            >
              <path
                d={mood === "happy" ? "M1,0 Q8,10 15,0" : mood === "bored" ? "M1,3 Q8,3 15,3" : "M1,2 Q8,6 15,2"}
                stroke="#c0502a"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            {/* 胡须左 */}
            <div className="absolute bg-zinc-500 rounded-full" style={{ width: 14, height: 1.5, top: "53%", left: 2, transform: "rotate(-10deg)" }} />
            <div className="absolute bg-zinc-500 rounded-full" style={{ width: 14, height: 1.5, top: "58%", left: 0, transform: "rotate(5deg)" }} />
            {/* 胡须右 */}
            <div className="absolute bg-zinc-500 rounded-full" style={{ width: 14, height: 1.5, top: "53%", right: 2, transform: "rotate(10deg)" }} />
            <div className="absolute bg-zinc-500 rounded-full" style={{ width: 14, height: 1.5, top: "58%", right: 0, transform: "rotate(-5deg)" }} />
          </div>

          {/* 尾巴 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 30,
              background: "linear-gradient(to top, #ff8c00, #ffaa33)",
              bottom: "10%",
              right: -6,
              transformOrigin: "bottom center",
              transform: "rotate(25deg)",
            }}
            animate={{
              rotate: [25, 45, 20, 35, 25],
              scaleY: [1, 0.9, 1],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* 情绪指示器 */}
        <motion.div
          className="absolute -top-1 -right-1 text-lg select-none pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.4 }}
          key={mood}
        >
          {mood === "happy" && "💛"}
          {mood === "normal" && "🧡"}
          {mood === "bored" && "💤"}
        </motion.div>
      </div>
    </motion.div>
  );
}
