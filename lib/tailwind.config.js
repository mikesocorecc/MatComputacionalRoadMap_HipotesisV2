module.exports = {
    mode: 'jit',
    content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'pre-yellow': '#FFCC0D',
                'pre-yellow-hover': '#FFFB00',
                'pro-red': '#ED2A2F',
                'pro-red-hover': '#FF5601',
                'elite-orange': '#FF5601',
                'elite-orange-hover': '#FF8001',
                'mentor-orange': '#FF8001',
                'mentor-orange-hover': '#FFAA01',
                'abc-orange': '#FFAA01',
                'abc-hover': '#FFCC0D',
                'reset-dark': '#495259',
                'reset-dark-hover': '#A4A4A4',
                'green-feedback': '#52e1c9',
                'red-feedback': '#ff7c80'
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: []
};
