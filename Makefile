JS_FILES := \
	src/zzfx.js \
	src/constants.js \
	src/utils.js \
	src/monsterActions.js \
	src/sprite.js \
	src/character.js \
	src/card.js \
	src/player.js \
	src/monsterLibrary.js \
	src/cardLibrary.js \
	src/cardManager.js \
	src/enemyManager.js \
	src/eventUi.js \
	src/gameFlow.js \
	src/main.js

IMAGES := $(wildcard src/*.png)
IMAGES_DIST := $(IMAGES:src/%=dist/%)
IMAGES_DEV := $(IMAGES:src/%=dev/%)

JS_DEV := $(JS_FILES:src/%=dev/%)


.PHONY: all report clean

all: $(IMAGES_DEV) dev/index.html out.zip report

clean:
	rm -rf dev/*
	rm -rf dev/.[!.]*
	rm -rf dist/*
	rm -rf dist/.[!.]*
	rm -rf build/*
	rm -rf build/.[!.]*

dev/%.png: src/%.png
	cp $^ $@

dev/%.js: src/%.js
	cp $^ $@

dev/styles.css: build/styles-min.css
	cp $^ $@

dev/index.html: build/index.html $(IMAGES_DEV) $(JS_DEV) combine-dev.py dev/styles.css
	python3 combine-dev.py $(JS_DEV) > $@


build/main-min.js: $(JS_FILES)
	@echo $@ "<-" $^
	@cat $^ > build/main-max.js
	npx google-closure-compiler --js=build/main-max.js --js_output_file=$@ --compilation_level=ADVANCED

build/styles-min.css: src/styles.scss
	@echo $@ "<-" $^
	@npx sass $^ $@ --style=compressed --no-source-map

build/index.html: src/index.html
	@echo $@ "<-" $^
	@ npx html-minifier \
		--collapse-whitespace \
		--remove-comments \
		--remove-optional-tags \
		--remove-redundant-attributes \
		--remove-script-type-attributes \
		--remove-tag-whitespace \
		-o $@ \
		$^


dist/%.png: src/%.png
	@echo $@ "<-" $^
	@cp $^ $@
	@optipng -o7 -zm1-9 -strip all -fix -quiet $@

dist/styles-min.css: build/styles-min.css
	cp $^ $@

dist/index.html: build/index.html build/main-min.js build/styles-min.css combine.py
	@echo $@ "<-" $^
	@python3 combine.py > $@

out.zip: dist/index.html $(IMAGES_DIST)
	@echo $@ "<-" $^
	@rm -f $@
	@cd dist && 7z a -tzip -bd -bso0 -bsp0 -mx9 $@ $($^:dist/%=%)
	@mv dist/$@ $@
	@npx advzip --recompress --shrink-insane -q -i250 $@
	@rm -rf test_extract
	@unzip out.zip -d test_extract > /dev/null

report: out.zip
	@echo '------------------------------------';
	@echo;
	@FILE_SIZE=$$(stat -c%s out.zip 2>/dev/null || stat -f%z out.zip); \
		PERCENT=$$(awk -v f="$$FILE_SIZE" -v t="13312" 'BEGIN { printf "%.3f", (f/t)*100 }'); \
		if (( $$(echo "$$PERCENT > 100" | bc -l) )); then \
			MESSAGE=$$(echo "🛑 TOO LARGE 🛑"); \
		else \
			MESSAGE=$$(echo "👍"); \
		fi; \
		echo "    $$FILE_SIZE / 13,312  =  $$PERCENT%  $$MESSAGE"
	@FILE_SIZE=$$(stat -c%s dist/c.png 2>/dev/null || stat -f%z dist/c.png); \
		PERCENT=$$(awk -v f="$$FILE_SIZE" -v t="13312" 'BEGIN { printf "%.3f", (f/t)*100 }'); \
		echo "      * c.png: $$FILE_SIZE (pre-zip)"
	@echo;
	@echo '------------------------------------';
