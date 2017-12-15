<template>
    <div>
        <index-header></index-header>
        <index-body></index-body>
        <index-footer></index-footer>
    </div>
</template>

<script>
import Header from '@/components/index/Header';
import Footer from '@/components/index/Footer';
import Body from '@/components/index/Body';

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
