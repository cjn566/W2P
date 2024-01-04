<template>
    <div id="entry">

        <div id="hexagon"></div>

    </div>
</template>

<script setup>
</script>

<style scoped lang="scss">

$hex-core-height: 100px;
$hex-width: $hex-core-height * 1.732;
$hex-height-offset: $hex-core-height / 2;
$hex-half-width: $hex-width / 2;
$hex-color: #70e760;

#entry {
    margin: 100px;
    margin-bottom: 100px;
}

#hexagon {
  width: $hex-width;
  height: $hex-core-height;
  border-radius: 2px;
  background: $hex-color;
  position: relative;
  border-left: 2px solid gold;
}
#hexagon::before {
  content: "";
  position: absolute;
  top: -$hex-height-offset + 1;
  left: 0;
  width: 0;
  height: 0;
  border-left: $hex-half-width solid gold;
  border-right: $hex-half-width solid gold;
  border-bottom: $hex-height-offset solid $hex-color;
}
#hexagon::after {
  content: "";
  position: absolute;
  bottom: -$hex-height-offset + 1;
  left: 0;
  width: 0;
  height: 0;
  border-left: $hex-half-width solid transparent;
  border-right: $hex-half-width solid transparent;
  border-top: $hex-height-offset solid $hex-color;
}


</style>