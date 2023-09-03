<template>
    <div class="modal fade" id="gameSearchModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <ul class="nav nav-tabs nav-justified">
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: tab == 'single' }" @click="tab = 'single'" href="#">Add
                                Games</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: tab == 'import' }" @click="tab = 'import'" href="#">Import
                                Collection</a>
                        </li>
                    </ul>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ModalGameSearch v-show="tab == 'single'" />
                    <ModalImport v-show="tab == 'import'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const tab = ref('import')
</script>

<style scoped></style>