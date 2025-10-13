import { defineComponent } from 'vue';

const icons = [
  'fa-coins', 'fa-star', 'fa-dice', 'fa-ticket-alt', 'fa-money-bill', 'fa-gem'
];
const colors = [
  'text-yellow-400', 'text-orange-400', 'text-green-400', 'text-blue-300', 'text-yellow-300', 'text-white'
];

export const ParticleIcon = defineComponent({
  props: { index: Number },
  setup(props) {
    const icon = icons[props.index! % icons.length];
    const color = colors[props.index! % colors.length];
    const top = Math.random() * 90;
    const left = Math.random() * 95;
    const size = 24 + Math.random() * 36;
    const duration = 8 + Math.random() * 10;
    const delay = Math.random() * -10;

    return () => (
      <i
        class={['fas', icon, color, 'opacity-30', 'animate-float']}
        style={{
          position: 'absolute',
          top: `${top}%`,
          left: `${left}%`,
          fontSize: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`
        }}
      ></i>
    );
  }
});