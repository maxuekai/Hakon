<template>
    <div>
        <index-header></index-header>
        <index-body></index-body>
        <index-footer></index-footer>
    </div>
</template>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Body from '@/components/Body';

export default {
  components: {
    'index-header': Header,
    'index-footer': Footer,
    'index-body': Body
  }
};
</script>

<style scoped>

</style>
