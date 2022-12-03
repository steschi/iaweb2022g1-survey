# Makefile to simplify compilation process

DOCNAME=survey

all: survey

.PHONY: clean

survey:
	pdflatex -shell-escape $(DOCNAME).tex
	biber $(DOCNAME)
	pdflatex -shell-escape $(DOCNAME).tex
	pdflatex -shell-escape $(DOCNAME).tex

view: survey
	open $(DOCNAME).pdf

clean:
	rm *.blg *.bbl *.aux *.log
