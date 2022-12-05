# Makefile to simplify compilation process

DOCNAME=survey

all: survey clean

.PHONY: clean

survey:
	pdflatex -shell-escape $(DOCNAME).tex
	biber $(DOCNAME)
	pdflatex -shell-escape $(DOCNAME).tex
	pdflatex -shell-escape $(DOCNAME).tex
	pdflatex -shell-escape $(DOCNAME).tex

view: survey
	open $(DOCNAME).pdf

clean:
	rm -f *.blg *.bbl *.aux *.log *.dvi *.bcf *.blg *.lof *.out *.run.xml *.toc *.lol
